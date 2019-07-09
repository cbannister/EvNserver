<?php
/**
 * Created by PhpStorm.
 * User: David
 * Date: 2017-04-02
 * Time: 7:45 PM
 */
namespace Evn\util;

/**
 * Class DBUtil
 * @package Evn\util
 * Utility Class for assisting database queries
 */
class DBUtil {
    /**
     * Takes an array of detail data and updates the detail table
     * @param $db
     * @param $details
     */
    public static function updateDetail($db, $detail) {
        $query = 'UPDATE `detail` as `d` '
            . 'SET `d`.`name`=:name, `d`.`short_desc`=:shortDesc, `d`.`long_desc`=:longDesc, '
            . '`d`.`thumb_url`=:thumbURL, `d`.`image_url`=:imageURL, `d`.`phone`=:phone, '
            . '`d`.`website`=:website, `d`.`cost`=:cost, `d`.`email`=:email '
            . 'WHERE `d`.`id`=:detailId';
        $stmt = $db->prepare($query);

        // Bind the Parameters
        $stmt->bindParam(':detailId', $detail['id'], \PDO::PARAM_INT);
        $stmt->bindParam(':name', $detail['name'], \PDO::PARAM_STR);
        $stmt->bindParam(':shortDesc', $detail['shortDesc'], \PDO::PARAM_STR);
        $stmt->bindParam(':longDesc', $detail['longDesc'], \PDO::PARAM_STR);
        $stmt->bindParam(':thumbURL', $detail['thumbURL'], \PDO::PARAM_STR);
        $stmt->bindParam(':imageURL', $detail['imageURL'], \PDO::PARAM_STR);
        $stmt->bindParam(':phone', $detail['phone'], \PDO::PARAM_STR);
        $stmt->bindParam(':website', $detail['website'], \PDO::PARAM_STR);
        $stmt->bindParam(':cost', $detail['cost'], \PDO::PARAM_INT);
        $stmt->bindParam(':email', $detail['email'], \PDO::PARAM_STR);
        $stmt->execute();

        self::updateDetailActivityMap($db, $detail);
    }

    /**
     * Takes an array of detail data and adds it to the detail table
     * Returns the detailId
     * @param $db
     * @param $details
     */
    public static function addDetail($db, $detail) {
        $query = 'INSERT INTO `detail` '
            . '(`name`,`short_desc`,`long_desc`, `image_url`, `thumb_url`, `phone`, `website`,`cost`, `email`) '
            . 'VALUES (:name, :shortDesc, :longDesc, :imageURL, :thumbURL, :phone, :website, :cost, :email)';
        $stmt = $db->prepare($query);

        $email = !empty($detail['email']) ? $detail['email'] : '';
        // Bind the Parameters
        $stmt->bindParam(':name', $detail['name'], \PDO::PARAM_STR);
        $stmt->bindParam(':shortDesc', $detail['shortDesc'], \PDO::PARAM_STR);
        $stmt->bindParam(':longDesc', $detail['longDesc'], \PDO::PARAM_STR);
        $stmt->bindParam(':imageURL', $detail['imageURL'], \PDO::PARAM_STR);
        $stmt->bindParam(':thumbURL', $detail['thumbURL'], \PDO::PARAM_STR);
        $stmt->bindParam(':phone', $detail['phone'], \PDO::PARAM_STR);
        $stmt->bindParam(':website', $detail['website'], \PDO::PARAM_STR);
        $stmt->bindParam(':cost', $detail['cost'], \PDO::PARAM_INT);
        $stmt->bindParam(':email', $email, \PDO::PARAM_STR);
        $stmt->execute();

        $detailId = $db->getLastInsertId();

        $detail['id'] = $detailId;
        self::updateDetailActivityMap($db, $detail);

        return $detailId;
    }

    /**
     * Updates the detail_activity_map
     * @param $db
     * @param $detail
     */
    public static function updateDetailActivityMap($db, $detail) {
        if (empty($detail['activities'])) {
            throw new Exception('Activites undefined');
        }

        // Update the detail_activity_map
        $query = 'DELETE FROM detail_activity_map WHERE `detail_id`=:detailId';
        $stmt = $db->prepare($query);
        $stmt->bindParam(':detailId', $detail['id'], \PDO::PARAM_INT);
        $stmt->execute();

        foreach($detail['activities'] as $activity) {
            $query = 'INSERT INTO detail_activity_map '
                . '(`detail_id`, `activity_id`) VALUES '
                . '(:detailId, :activityId)';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':detailId', $detail['id'], \PDO::PARAM_INT);
            $stmt->bindParam(':activityId', $activity['id'], \PDO::PARAM_INT);
            $stmt->execute();
        }
    }

    /**
     * Updates the detail_activity_map
     * @param $db
     * @param $detail
     */
    public static function updateEventDestinationMap($db, $event) {
        // Update the detail_activity_map
        $query = 'DELETE FROM event_destination_map WHERE `event_id`=:eventId';
        $stmt = $db->prepare($query);
        $stmt->bindParam(':eventId', $event['id'], \PDO::PARAM_INT);
        $stmt->execute();

        if (empty($event['destinations'])) {
            return;
        }

        foreach($event['destinations'] as $destinationId) {
            $query = 'INSERT INTO event_destination_map '
                . '(`event_id`, `destination_id`) VALUES '
                . '(:eventId, :destinationId)';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':eventId', $event['id'], \PDO::PARAM_INT);
            $stmt->bindParam(':destinationId', $destinationId, \PDO::PARAM_INT);
            $stmt->execute();
        }
    }
}